import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Table } from '../../components/Table';
import type { Career } from './types';
import { Tooltip } from '../../components/Tooltip';

// TODO: Make env its own package that pre-validates required env vars using schema validation
const { VITE_API_BASE_URL } = import.meta.env;

export const Route = createFileRoute('/careers/')({
  component: CareersEntrypoint,
});

// Switched to Functional components to leverage useQuery.
function CareersEntrypoint() {
  const {
    data: careers = [],
    isLoading,
    isError,
    error,
  } = useQuery<Career[]>({
    queryKey: ['careers'],
    queryFn: () =>
      // TODO: Schema-validate the response
      fetch(`${VITE_API_BASE_URL}/careers/`).then((response) => response.json()),
  });

  if (isLoading) {
    // TODO: Improve loading state. Skeletons or loader
    return <span>Loading...</span>;
  }

  if (isError) {
    // TODO: Improve error state. Consider using Toasts or similar
    return <span className="font-bold text-red-700">Error: {error.message}</span>;
  }

  return (
    <div className="min-h-screen bg-white p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Careers</h1>
        <Tooltip text="Out of MVP scope">
          <Link
            className="cursor-not-allowed rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            to="/careers/create"
            // TODO: extend this functionality. Out of scope
            disabled
          >
            + Add Career
          </Link>
        </Tooltip>
      </header>

      <Table
        items={careers}
        // TODO: Extend to Edit/Delete too here
        additionalCustomRow={(index: number) => (
          <Link
            className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
            to={`/careers/$careerId/find-candidate`}
            params={{ careerId: careers[index].id }}
          >
            Find best match
          </Link>
        )}
      />
    </div>
  );
}
