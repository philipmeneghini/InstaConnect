using Backend.Services.Interfaces;
using Backend.Models;
using Backend.Models.Config;
using Util.Exceptions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {

        private IUserService _userService;
        private readonly HashSettings _hash;
        private readonly JwtSettings _jwtSettings;

        public AuthService(IUserService userService, IOptions<HashSettings> hash, IOptions<JwtSettings> jwtSettings)
        {
            _userService = userService;
            _hash = hash.Value;
            _jwtSettings = jwtSettings.Value;
        }

        public async Task<string> Login(LoginBody request)
        {
            if (request.Email.IsNullOrEmpty() || request.Password.IsNullOrEmpty())
                throw new InstaBadRequestException("missing email or password");
            var user = await _userService.GetUserAsync(request.Email);
            if (!CheckHash(user.Password, request.Password))
                throw new InstaBadRequestException("invalid password");
            return GenerateToken(user);
        }

        public async Task<UserModel> Register(LoginBody request)
        {
            if (request.Email.IsNullOrEmpty() || request.Password.IsNullOrEmpty())
                throw new InstaBadRequestException("missing email or password");
            var user = await _userService.GetUserAsync(request.Email);
            var hash = Hash(request.Password);
            user.Password = hash;
            return await _userService.UpdateUserAsync(user);
        }

        public string GenerateToken(UserModel user)
        {
            string fullName = user.FirstName + " " + user.LastName;

            var jwtTokenHandler = new JwtSecurityTokenHandler();

            List<Claim> claims = new List<Claim>()
            {
                new Claim("email", user.Email),
                new Claim("name", fullName),    
                new Claim("DateOfBirth", user.BirthDate)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtSettings.Key));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            var jwt = jwtTokenHandler.WriteToken(token);
            return jwt;
        }

        private string Hash(string password)
        {
            using( var alg = new Rfc2898DeriveBytes (
                password,
                _hash.SaltSize,
                _hash.Iterations,
                HashAlgorithmName.SHA256
                ))
            {
                var key = Convert.ToBase64String(alg.GetBytes(_hash.KeySize));
                var salt = Convert.ToBase64String(alg.Salt);

                return $"{_hash.Iterations}.{salt}.{key}";
            }
        }

        private bool CheckHash(string hash, string password)
        {
            var sections = hash.Split('.', 3);
            if (sections.Length != 3)
                return false;

            var iterations = Convert.ToInt32(sections[0]);
            var salt = Convert.FromBase64String(sections[1]);
            var key = Convert.FromBase64String(sections[2]);

            using (var algorithm = new Rfc2898DeriveBytes(
                password,
                salt,
                iterations,
                HashAlgorithmName.SHA256))
            {
                var keyToCheck = algorithm.GetBytes(_hash.KeySize);

                return keyToCheck.SequenceEqual(key);
            }

        }
    }
}
