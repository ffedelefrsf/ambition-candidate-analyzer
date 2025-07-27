import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-12 text-center text-2xl font-bold">
          What Ambition Candidate Analyzer Can Do
        </h2>
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          <Feature
            icon="📄"
            title="Smart Resume Analysis"
            description="Parse key skills, experiences, and achievements in seconds."
          />
          <Feature
            icon="🎯"
            title="Role Matching"
            description="Evaluate candidates against specific job descriptions."
          />
          <Feature
            icon="⚡"
            title="Fast & Accurate"
            description="Get results in real-time, powered by OpenAI's models."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow transition hover:shadow-md dark:bg-gray-800">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
