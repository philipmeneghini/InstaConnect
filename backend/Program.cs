using Backend.Services;
using InstaConnect.Services;
using Util.Constants;
using Backend.Models;
using Backend.Interfaces;
using Backend.UserServices;
using Backend.Middleware;
using InstaConnect.Models;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Backend.Validators.UserValidators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.Configure<ConnectionStringModel>(builder.Configuration.GetSection(ApplicationConstants.ConnectionStrings));
builder.Services.Configure<SettingsModel<UserModel>>(builder.Configuration.GetSection(ApplicationConstants.UserModel));
builder.Services.Configure<AmazonS3CredentialsModel>(builder.Configuration.GetSection(ApplicationConstants.AmazonS3Credentials));
builder.Services.Configure<HashSettings>(builder.Configuration.GetSection(ApplicationConstants.Hash));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(ApplicationConstants.Jwt));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<ExceptionHandlingMiddleware>();
builder.Services.AddSingleton<IValidator<string>, DeleteGetUserValidator>();
builder.Services.AddSingleton<IValidator<UserModel>, CreateUpdateUserValidator>();
builder.Services.AddSingleton<ValidatorUserHelpers, ValidatorUserHelpers>();
builder.Services.AddSingleton<IMediaService, MediaService>();
builder.Services.AddSingleton<IMongoDbService<UserModel>, MongoDbService<UserModel>>();
builder.Services.AddSingleton<IUserService, UserService>();
builder.Services.AddSingleton<IAuthService, AuthService>();

builder.Services.AddCors(p => p.AddPolicy("corspolicy", build =>
{
    build.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
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
        (Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),

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

app.UseCors("corspolicy");

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();