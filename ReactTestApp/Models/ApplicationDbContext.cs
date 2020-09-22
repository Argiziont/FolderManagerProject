﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using ReactTestApp.Models.AuthModel;
using System.Collections.Generic;

namespace ReactTestApp.Models
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Folder> Folders { get; set; }
        public DbSet<FileHolder> Files { get; set; }
        public DbSet<User> Users { get; set; }

    }
}
