import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Layout } from "@/components/layout";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FilterSection } from "@/components/filter-section";
import { ProjectsTable } from "@/components/projects-table";
import { Loader } from "@/components/loader";
import { getProjects, setFilter, clearFilters } from "@/store/projects-slice";
import { getProjectSchema } from "@/config/projects-table";
import { useAuth } from "@/hooks/auth";

export default function Projects() {
  const [projectType, setProjectType] = useState(() => {
    return localStorage.getItem("projectType") || "projects1";
  });

  const { user } = useAuth();
  const dispatch = useDispatch();
  const { loading, filteredProjects, filters } = useSelector(
    (state) => state.projects
  );

  useEffect(() => {
    dispatch(clearFilters());

    dispatch(getProjects(projectType));

    localStorage.setItem("projectType", projectType);
  }, [dispatch, projectType]);

  const handleFilterChange = (filterName, value) => {
    dispatch(setFilter({ filterName, value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Projets
            </h1>

            <Select onValueChange={(value) => setProjectType(value)}>
              <SelectTrigger>
                <SelectValue
                  placeholder={`${
                    projectType == "projects1" ? "Projet 1" : "Projet 2"
                  }`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="projects1">Projet 1</SelectItem>
                <SelectItem value="projects2">Projet 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 sm:mt-0 text-gray-600 dark:text-gray-300">
            <span className="font-medium">Bienvenue, </span>
            <span className="font-bold">{user?.fname}</span>
          </div>
        </div>

        <section className="mb-8">
          <FilterSection
            fields={getProjectSchema(projectType).fields}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </section>

        {loading ? (
          <Loader />
        ) : (
          <section>
            <ProjectsTable
              type={projectType}
              columns={getProjectSchema(projectType).columns}
              projects={filteredProjects}
            />
          </section>
        )}
      </div>
    </Layout>
  );
}
