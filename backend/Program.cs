using Backend.Services;
using Util.Constants;
using Backend.Services.Interfaces;
using Backend.Middleware;
using Backend.Models;
using FluentValidation;
using Backend.Validators.UserValidators;
using Backend.Validators.ContentValidators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Backend.Models.Config;
using Backend.Models.Validation;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.Configure<ConnectionStringModel>(builder.Configuration.GetSection(ApplicationConstants.ConnectionStrings));
builder.Services.Configure<MongoSettings<UserModel>>(builder.Configuration.GetSection(ApplicationConstants.UserModel));
builder.Services.Configure<MongoSettings<ContentModel>>(builder.Configuration.GetSection(ApplicationConstants.ContentModel));
builder.Services.Configure<AmazonS3CredentialsModel>(builder.Configuration.GetSection(ApplicationConstants.AmazonS3Credentials));
builder.Services.Configure<HashSettings>(builder.Configuration.GetSection(ApplicationConstants.Hash));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(ApplicationConstants.Jwt));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<ExceptionHandlingMiddleware>();

builder.Services.AddSingleton<IValidator<UserEmailValidationModel>, UserEmailValidator>();
builder.Services.AddSingleton<IValidator<UserModel>, UserModelValidator>();
builder.Services.AddSingleton<IValidator<ContentIdValidationModel>, ContentIdValidator>();
builder.Services.AddSingleton<IValidator<ContentEmailValidationModel>, ContentEmailValidator>();
builder.Services.AddSingleton<IValidator<ContentModel>, ContentModelValidator>();
builder.Services.AddSingleton<ValidatorUserHelpers, ValidatorUserHelpers>();
builder.Services.AddSingleton<ValidatorContentHelpers, ValidatorContentHelpers>();
builder.Services.AddSingleton<IMediaService, MediaService>();
builder.Services.AddSingleton<IUserService, UserService>();
builder.Services.AddSingleton<IAuthService, AuthService>();
builder.Services.AddSingleton<IContentService, ContentService>();

builder.Services.AddCors(p => p.AddPolicy(ApplicationConstants.CorsPolicy, build =>
{
    build.WithOrigins(ApplicationConstants.Star).AllowAnyMethod().AllowAnyHeader();
}));

builder.Services.AddAuthorization();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(jwt =>
{
    jwt.SaveToken = true;

    jwt.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey
        (Encoding.UTF8.GetBytes(builder.Configuration[ApplicationConstants.JwtKey])),

        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = false,
        ValidateIssuerSigningKey = true,
        RequireExpirationTime = false
    };
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(ApplicationConstants.CorsPolicy);

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();