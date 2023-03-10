using System.Transactions;

namespace Backend.Util.Exceptions
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
}
