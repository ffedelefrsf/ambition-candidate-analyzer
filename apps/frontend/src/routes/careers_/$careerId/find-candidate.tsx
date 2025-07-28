import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import type { Career } from '../../careers/types';

// TODO: Make env its own package that pre-validates required env vars using schema validation
const { VITE_API_BASE_URL } = import.meta.env;

type RawCareer = {
  id: string;
  position: string;
  description: string;
  requirements: string;
  nice_to_have: string;
  rate_range: string;
};

async function fetchCareer(careerId: string) {
  const response = await fetch(`${VITE_API_BASE_URL}/careers/${careerId}`);
  const {
    id,
    position,
    description,
    requirements,
    nice_to_have: niceToHave,
    rate_range: rateRange,
  }: RawCareer = await response.json();
  // TODO: Schema-validate the response
  return {
    id,
    position,
    description,
    requirements,
    niceToHave,
    rateRange,
  };
}

const RouteComponent = () => {
  const career = Route.useLoaderData();
  return <FindCandidate career={career} />;
};

// TODO: Add unit tests for this component to simulate all use cases and make sure there are no gaps
export const Route = createFileRoute('/careers_/$careerId/find-candidate')({
  loader: ({ params }) => {
    return fetchCareer(params.careerId);
  },
  component: RouteComponent,
});

type Props = { career: Career };

type State = {
  loading: boolean;
  bestCandidate: string;
  reasons: string[];
  bestAlternative: string;
  alternativeReasons: string[];
};

class FindCandidate extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      bestCandidate: '',
      reasons: [],
      bestAlternative: '',
      alternativeReasons: [],
      loading: true,
    };
  }

  componentDidMount(): void {
    (async () => {
      const response = await fetch(
        `${VITE_API_BASE_URL}/careers/${this.props.career.id}/find-best-candidate`,
      );
      try {
        const result = await response.json();
        // TODO: Schema-validate the response
        this.setState((prevState) => ({
          ...prevState,
          ...result,
        }));
      } finally {
        this.setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    })();
  }

  render() {
    const { description, niceToHave, position, rateRange, requirements } =
      this.props.career;
    const { bestCandidate, reasons, bestAlternative, alternativeReasons, loading } =
      this.state;

    const listedRequirements = requirements.split(',').map((r) => r.trim());
    const listedNiceToHave = niceToHave.split(',').map((n) => n.trim());

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-black dark:text-white">
            🎯 Evaluating best fit for:{' '}
            <span className="text-indigo-600 underline dark:text-indigo-300">
              {position}
            </span>
          </h1>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold">📜 Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{description}</p>
          </div>

          <div className="space-y-4 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold">🎖️ Nice to Have</h2>
            <ul className="list-inside list-disc space-y-1">
              {listedNiceToHave.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold">🧩 Requirements</h2>
            <ul className="list-inside list-disc space-y-1">
              {listedRequirements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold">💸 Rate Range</h2>
            <p className="text-gray-700 dark:text-gray-300">{rateRange}</p>
          </div>
        </section>

        <div className="mt-10">
          {/* TODO: Improve skeletons height since they are causing a ton of shift here */}
          {loading ? (
            <div className="grid gap-6">
              {/* Skeleton block for best candidate */}
              <div className="animate-pulse space-y-3 rounded-lg bg-gray-200 p-6 dark:bg-gray-700">
                <div className="h-6 w-1/2 rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-4 w-4/5 rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600" />
              </div>

              {/* Skeleton block for alternative candidate */}
              <div className="animate-pulse space-y-3 rounded-lg bg-gray-200 p-6 dark:bg-gray-700">
                <div className="h-5 w-1/3 rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-4 w-4/5 rounded bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              <div className="animate-fade-in-up rounded-lg border-l-8 border-green-500 bg-green-100 p-6 text-green-900 shadow-lg dark:bg-green-900 dark:text-green-100">
                <h2 className="mb-2 text-2xl font-bold">
                  {/* TODO: Convert this into a link that downloads the resume or takes you to the corresponding LinkedIn page */}
                  🎉 Best Candidate: <span className="underline">{bestCandidate}</span>
                </h2>
                <ul className="list-inside list-disc space-y-1">
                  {reasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </div>

              {bestAlternative && (
                <div className="animate-fade-in-up rounded-lg border-l-8 border-yellow-500 bg-yellow-100 p-6 text-yellow-900 shadow-md dark:bg-yellow-900 dark:text-yellow-100">
                  <h3 className="mb-2 text-xl font-semibold">
                    🏅 Strong Alternative:{' '}
                    <span className="underline">{bestAlternative}</span>
                  </h3>
                  <ul className="list-inside list-disc space-y-1">
                    {alternativeReasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
