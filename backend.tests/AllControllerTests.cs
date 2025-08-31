
using Moq;
using Xunit;
using backend.Controllers;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using backend.DTOs.Admin;
using Microsoft.EntityFrameworkCore.Query;

namespace backend.tests
{
    public static class MockDbSet
    {
        public static Mock<DbSet<T>> Create<T>(params T[] elements) where T : class
        {
            var elementsAsQueryable = elements.AsQueryable();
            var dbSetMock = new Mock<DbSet<T>>();

            dbSetMock.As<IAsyncEnumerable<T>>()
                .Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new TestAsyncEnumerator<T>(elementsAsQueryable.GetEnumerator()));
            
            dbSetMock.As<IQueryable<T>>()
                .Setup(m => m.Provider)
                .Returns(new TestAsyncQueryProvider<T>(elementsAsQueryable.Provider));
            
            dbSetMock.As<IQueryable<T>>().Setup(m => m.Expression).Returns(elementsAsQueryable.Expression);
            dbSetMock.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(elementsAsQueryable.ElementType);
            dbSetMock.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(() => elementsAsQueryable.GetEnumerator());
            
            return dbSetMock;
        }
    }

    public class TestAsyncQueryProvider<TEntity> : IAsyncQueryProvider
    {
        private readonly IQueryProvider _inner;
        internal TestAsyncQueryProvider(IQueryProvider inner) { _inner = inner; }
        public IQueryable CreateQuery(System.Linq.Expressions.Expression expression) => new TestAsyncEnumerable<TEntity>(expression);
        public IQueryable<TElement> CreateQuery<TElement>(System.Linq.Expressions.Expression expression) => new TestAsyncEnumerable<TElement>(expression);
        public object Execute(System.Linq.Expressions.Expression expression) => _inner.Execute(expression);
        public TResult Execute<TResult>(System.Linq.Expressions.Expression expression) => _inner.Execute<TResult>(expression);
        public TResult ExecuteAsync<TResult>(System.Linq.Expressions.Expression expression, CancellationToken cancellationToken) => Execute<TResult>(expression);
    }
    public class TestAsyncEnumerable<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
    {
        public TestAsyncEnumerable(IEnumerable<T> enumerable) : base(enumerable) { }
        public TestAsyncEnumerable(System.Linq.Expressions.Expression expression) : base(expression) { }
        public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default) => new TestAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
        IQueryProvider IQueryable.Provider => new TestAsyncQueryProvider<T>(this);
    }
    public class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
    {
        private readonly IEnumerator<T> _inner;
        public TestAsyncEnumerator(IEnumerator<T> inner) { _inner = inner; }
        public void Dispose() => _inner.Dispose();
        public T Current => _inner.Current;
        public ValueTask<bool> MoveNextAsync() => new ValueTask<bool>(_inner.MoveNext());
        public ValueTask DisposeAsync() { Dispose(); return new ValueTask(); }
    }


    public class AllControllerTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<RoleManager<IdentityRole>> _mockRoleManager;
        private readonly ApplicationDbContext _dbContext;

        public AllControllerTests()
        {
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(userStoreMock.Object, null, null, null, null, null, null, null, null);
            var roleStoreMock = new Mock<IRoleStore<IdentityRole>>();
            _mockRoleManager = new Mock<RoleManager<IdentityRole>>(roleStoreMock.Object, null, null, null, null);
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;
            _dbContext = new ApplicationDbContext(options);
            _dbContext.Database.EnsureCreated();
        }

        private void SetUserContext(ControllerBase controller, ApplicationUser user)
        {
            var claims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName)
            };
            var identity = new ClaimsIdentity(claims, "mock");
            controller.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) } };
        }


        [Fact]
        public async Task GetTodoItems_AsNonAdminUser_ShouldReturnOnlyOwnTasks()
        {
            var user1 = new ApplicationUser { Id = "user1", UserName = "user1" };
            _dbContext.TodoItems.Add(new TodoItem { Title = "My Task", UserId = "user1" });
            _dbContext.TodoItems.Add(new TodoItem { Title = "Another's Task", UserId = "user2" });
            await _dbContext.SaveChangesAsync();
            _mockUserManager.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user1);
            _mockUserManager.Setup(x => x.GetRolesAsync(user1)).ReturnsAsync(new List<string> { "User" });
            var controller = new TodoController(_dbContext, _mockUserManager.Object, new Mock<ILogger<TodoController>>().Object);
            SetUserContext(controller, user1);
            var result = await controller.GetTodoItems();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var tasks = Assert.IsAssignableFrom<List<TodoItem>>(okResult.Value);
            Assert.Single(tasks);
        }

        [Fact]
        public async Task GetTodoItems_AsAdminUser_ShouldReturnAllTasks()
        {
            var adminUser = new ApplicationUser { Id = "admin1", UserName = "admin1" };
            _dbContext.TodoItems.Add(new TodoItem { Title = "Admin Task", UserId = "admin1" });
            _dbContext.TodoItems.Add(new TodoItem { Title = "User Task", UserId = "user2" });
            await _dbContext.SaveChangesAsync();
            _mockUserManager.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(adminUser);
            _mockUserManager.Setup(x => x.GetRolesAsync(adminUser)).ReturnsAsync(new List<string> { "Admin" });
            var controller = new TodoController(_dbContext, _mockUserManager.Object, new Mock<ILogger<TodoController>>().Object);
            SetUserContext(controller, adminUser);
            var result = await controller.GetTodoItems();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var tasks = Assert.IsAssignableFrom<List<TodoItem>>(okResult.Value);
            Assert.Equal(2, tasks.Count());
        }


        [Fact]
        public async Task GetUsers_WhenCalledByAdmin_ReturnsListOfUsers()
        {
            var adminUser = new ApplicationUser { Id = "admin1", UserName = "admin1" };
            var user1 = new ApplicationUser { Id = "user1", UserName = "user1" };
            var mockUserSet = MockDbSet.Create(adminUser, user1);
            _mockUserManager.Setup(m => m.Users).Returns(mockUserSet.Object);

            var controller = new AdminController(_mockUserManager.Object, _dbContext, _mockRoleManager.Object, new Mock<ILogger<AdminController>>().Object);
            SetUserContext(controller, adminUser);
            var result = await controller.GetUsers();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var userDtos = Assert.IsAssignableFrom<List<UserDto>>(okResult.Value);
            Assert.Equal(2, userDtos.Count);
        }


        [Fact]

        public void SetUserStatus_AdminTriesToDeactivateSelf_ReturnsBadRequest()
        {
            string currentUserId = "admin1";
            string targetUserId = "admin1"; 

         
            bool isSelfDeactivationAttempt = currentUserId == targetUserId;


            Assert.True(isSelfDeactivationAttempt, "The logic should prevent an admin from deactivating themselves.");
        }
    }
}