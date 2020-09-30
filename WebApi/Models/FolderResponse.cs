using System.Collections.Generic;

namespace FolderProjectApp.Models
{
    public class FolderResponse
    {
        public int FolderId { get; private set; }
        public string FolderName { get; private set; }
        public List<int> FilesIds { get; private set; }
        public List<string> FilesNames { get; private set; }
        public FolderResponse(int id, string name, List<int> ids, List<string> names)
        {
            FolderId = id;
            FolderName = name;
            FilesIds = ids;
            FilesNames = names;
        }
    }
}