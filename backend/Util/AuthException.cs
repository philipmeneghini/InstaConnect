namespace Backend.Util
{
    public abstract class AuthException : Exception
    {
        public int statusCode;
        public string message;
        public AuthException(string message) : base(message)
        {
            this.message = message;
        }
    }
    public class AuthBadRequestException : AuthException
    {
        public AuthBadRequestException(string message) : base(message)
        {
            this.statusCode = 400;
        }
    }

    public class UnauthenticatedException : AuthException
    {
        public UnauthenticatedException(string message) : base(message)
        {
            this.statusCode = 401;
        }
    }
}
