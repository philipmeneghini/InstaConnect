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

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.Configure<ConnectionStringModel>(builder.Configuration.GetSection(ApplicationConstants.ConnectionStrings));
builder.Services.Configure<SettingsModel<UserModel>>(builder.Configuration.GetSection(ApplicationConstants.UserModel));
builder.Services.Configure<AmazonS3CredentialsModel>(builder.Configuration.GetSection(ApplicationConstants.AmazonS3Credentials));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<ExceptionHandlingMiddleware>();
builder.Services.AddSingleton<IValidator<string>, GetUserValidator>();
builder.Services.AddSingleton<IValidator<string>, DeleteUserValidator>();
builder.Services.AddSingleton<IValidator<UserModel>, CreateUserValidator>();
builder.Services.AddSingleton<IValidator<UserModel>, UpdateUserValidator>();
builder.Services.AddSingleton<ValidatorUserHelpers, ValidatorUserHelpers>();
builder.Services.AddSingleton<IProfilePictureService, ProfilePictureService>();
builder.Services.AddSingleton<IMongoDbService<UserModel>, MongoDbService<UserModel>>();
builder.Services.AddSingleton<IUserService, UserService>();

builder.Services.AddCors(p => p.AddPolicy("corspolicy", build =>
{
    build.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
}));

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

app.UseAuthorization();

app.MapControllers();

app.Run();