// File: backend/Middleware/GlobalExceptionHandlerMiddleware.cs
using System.Net;
using System.Text.Json;

namespace backend.Middleware
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

        public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // If everything is fine, just continue to the next middleware/controller
                await _next(context);
            }
            catch (Exception ex)
            {
                // If an exception is caught, log it and handle the response
                _logger.LogError(ex, "An unhandled exception has occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Set the response status code
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // Create a clean, anonymous object for the error response
            var response = new
            {
                StatusCode = context.Response.StatusCode,
                Message = "An internal server error has occurred. Please try again later.",
                // In development, you might want to include the actual exception message for easier debugging.
                // In production, you would remove this line for security.
                // Detailed = exception.Message 
            };

            // Serialize the response to JSON and write it to the response body
            var jsonResponse = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(jsonResponse);
        }
    }
}