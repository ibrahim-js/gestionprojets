import { StatisticsCards } from "@/components/statistics-cards";
import { Layout } from "@/components/layout";

export default function Dashboard() {
  const totalProjects = 15;
  const todayProjects = 2;
  const totalUsers = 15;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Tableau de Bord
          </h1>
          <div className="mt-2 sm:mt-0 text-gray-600 dark:text-gray-300">
            <span className="font-medium">Bienvenue, </span>
            <span className="font-bold">Ibrahim</span>
          </div>
        </div>

        <section className="mb-8">
          <StatisticsCards
            totalProjects={totalProjects}
            todayProjects={todayProjects}
            totalUsers={totalUsers}
          />
        </section>
      </div>
    </Layout>
  );
}
