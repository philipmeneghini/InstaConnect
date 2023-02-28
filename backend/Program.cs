using Backend.Services;
using InstaConnect.Services;
using Backend.Services.InstaConnectServices;
using Util.Constants;
using Backend.Models;
using Backend.Interfaces;
using Backend.UserServices;
using Backend.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.Configure<ConnectionStringModel>(builder.Configuration.GetSection(ApplicationConstants.ConnectionStrings));
builder.Services.Configure<AmazonS3CredentialsModel>(builder.Configuration.GetSection(ApplicationConstants.AmazonS3Credentials));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<ExceptionHandlingMiddleware>();
builder.Services.AddSingleton<IS3BucketService, S3BucketService>();
builder.Services.AddSingleton<IMongoDbService, MongoDbService>();
builder.Services.AddSingleton<IInstaConnectServices, InstaConnectServices>();
builder.Services.AddSingleton<IUserServices, UserService>();

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