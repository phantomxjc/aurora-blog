import { getProjects } from "@/lib/api";
import { Folder, ExternalLink, Github, Star } from "lucide-react";
import { MotionDiv } from "@/components/Motion";
import Link from "next/link";
import dayjs from "dayjs";

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    const res = await getProjects();
    projects = res.data || [];
  } catch {}

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-12">
          <Folder className="w-6 h-6 text-aurora-500" />
          <h1 className="text-3xl font-bold font-serif text-gray-900">项目</h1>
          <span className="text-gray-400 text-lg">({projects.length} 个)</span>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <MotionDiv
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-hover group rounded-2xl bg-white border border-gray-100 overflow-hidden"
              >
                {project.coverImage && (
                  <div className="h-40 overflow-hidden">
                    <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold font-serif text-gray-900 group-hover:text-aurora-600 transition-colors">{project.title}</h3>
                    {project.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech: string) => (
                        <span key={tech} className="px-2.5 py-1 rounded-md bg-aurora-50 text-aurora-600 text-xs font-medium">{tech}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-aurora-600 hover:text-aurora-700">
                        <ExternalLink className="w-4 h-4" /> Demo
                      </a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        <Github className="w-4 h-4" /> Source
                      </a>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">{dayjs(project.published).format("YYYY-MM")}</span>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">暂无项目</div>
        )}
      </div>
    </div>
  );
}
