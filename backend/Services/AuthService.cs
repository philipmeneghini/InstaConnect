using Backend.Services.Interfaces;
using Backend.Models;
using Backend.Models.Config;
using Util.Exceptions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Util.Constants;
using Backend.Util;

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

        public async Task<LoginResponse> Login(LoginBody request)
        {
            if (request.Email.IsNullOrEmpty() || request.Password.IsNullOrEmpty())
                throw new InstaBadRequestException(ApplicationConstants.MisingEmailOrPassword);
            var user = await _userService.GetUserAsync(request.Email);
            if (!CheckHash(user.Password, request.Password))
                throw new InstaBadRequestException(ApplicationConstants.InvalidPassword);
            return new LoginResponse { Token = GenerateToken(user) };
        }

        public async Task<UserModel> Register(LoginBody request)
        {
            if (request.Email.IsNullOrEmpty() || request.Password.IsNullOrEmpty())
                throw new InstaBadRequestException(ApplicationConstants.MisingEmailOrPassword);
            var user = await _userService.GetUserAsync(request.Email);
            Helpers.RemoveUrls(ref user);
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
                new Claim(ApplicationConstants.Email, user.Email),
                new Claim(ApplicationConstants.Name, fullName),    
                new Claim(ApplicationConstants.DateOfBirth, user.BirthDate ?? string.Empty),
                new Claim(ApplicationConstants.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtSettings.Key));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(6),
                signingCredentials: creds);

            var jwt = jwtTokenHandler.WriteToken(token);
            return jwt;
        }

        public JwtModel VerifyToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                throw new InstaBadRequestException(ApplicationConstants.NoToken);
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            TokenValidationParameters validationParameters = new TokenValidationParameters()
            {
                ValidateLifetime = true,
                ValidateAudience = false,
                ValidateIssuer = false,
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtSettings.Key))
            };
            SecurityToken verifiedToken;
            try
            {
                var res = jwtTokenHandler.ValidateToken(token, validationParameters, out verifiedToken);
                var jwtModel = PopulateModel(res);
                return jwtModel;
            }
            catch (Exception ex)
            {
                throw new InstaBadRequestException(ex.Message);
            }
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

        private JwtModel PopulateModel(ClaimsPrincipal claims)
        {
            var res = new JwtModel();
            foreach (var claim in claims.Claims)
            {
                if (claim.Type.Equals(ApplicationConstants.Email, StringComparison.OrdinalIgnoreCase))
                    res.Email = claim.Value;
                else if (claim.Type.Equals(ApplicationConstants.Name, StringComparison.OrdinalIgnoreCase))
                    res.FullName = claim.Value;
                else if (claim.Type.Equals(ApplicationConstants.DateOfBirth, StringComparison.OrdinalIgnoreCase))
                    res.BirthDate = claim.Value;
                else if (claim.Type.Equals(ApplicationConstants.Role, StringComparison.OrdinalIgnoreCase))
                    res.Role = claim.Value;
                else if (claim.Type.Equals(ApplicationConstants.Exp, StringComparison.OrdinalIgnoreCase))
                    res.Expiration = Int32.Parse(claim.Value);
            }
            return res;
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
