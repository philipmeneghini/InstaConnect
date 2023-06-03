using Util.Constants;
using Util.Exceptions;

namespace Backend.Middleware
{
    public class ExceptionHandlingMiddleware: IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (InstaException ex)
            {
                context.Response.StatusCode = ex.statusCode;
                await context.Response.WriteAsync(ex.message);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                await context.Response.WriteAsync(ApplicationConstants.InternalServerError + ex.Message);
            }
        }
    }
}
