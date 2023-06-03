namespace Util.Exceptions
{
    public abstract class InstaException : Exception
    {
        public int statusCode;
        public string message;
        public InstaException(string message): base(message)
        {
            this.message = message;
        }
    }
    public class InstaNotFoundException: InstaException
    {
        public InstaNotFoundException(string message): base(message)
        {
            this.statusCode = 404;
        }
    }

    public class InstaBadRequestException: InstaException
    {
        public InstaBadRequestException(string message): base(message)
        {
            this.statusCode = 400;
        }
    }

    public class InstaGenericException: InstaException
    {
        public InstaGenericException(int statusCode, string message) : base(message)
        {
            this.statusCode = statusCode;
        }
    }

    public class InstaInternalServerException : InstaException
    {
        public InstaInternalServerException(string message) : base(message)
        {
            this.statusCode = 500;
        }
    }
}
