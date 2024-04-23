using Backend.Models;

namespace Backend.Util
{
    public abstract class Helper<T> where T : IInstaModel
    {
        protected bool OnlyOneDifference(string? difference, HashSet<string>? list1, HashSet<string>? list2)
        {
            if (difference == null || list1 == null || list2 == null)
                return false;
            var set = GetDifference(list1, list2);
            if ((set.Count == 1 && set.Contains(difference))
                || set.Count == 0)
                return true;
            return false;
        }

        protected HashSet<string> GetDifference(HashSet<string> h1, HashSet<string> h2)
        {
            return h1.Except(h2).Concat(h2.Except(h1)).ToHashSet();
        }
    }
}
