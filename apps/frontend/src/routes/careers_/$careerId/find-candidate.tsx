import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import type { Career } from '../../careers/types';

function fetchCareer(careerId: string) {
  return {
    id: careerId,
    position: 'Frontend Developer',
    description: 'Build UI components',
    requirements: 'React, JavaScript, HTML/CSS',
    niceToHave: 'Tailwind, Figma experience',
    rateRange: '$40 - $60/hr',
  };
}

const RouteComponent = () => {
  const career = Route.useLoaderData();
  return <FindCandidate career={career} />;
};

export const Route = createFileRoute('/careers_/$careerId/find-candidate')({
  loader: ({ params }) => {
    return fetchCareer(params.careerId);
  },
  component: RouteComponent,
});

type Props = { career: Career };

class FindCandidate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { description, niceToHave, position, rateRange, requirements } =
      this.props.career;
    const listedRequirements = requirements.split(',');
    const listedNiceToHave = niceToHave.split(',');
    return (
      <div className="min-h-screen bg-white p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <header>
          <h1 className="text-2xl font-bold dark:text-white">
            Finding best candidate for {position} position
          </h1>
          <div className="mt-4">
            <div className="my-2">
              <h2 className="dark:text-white">📜 Description</h2>
              <p className="p-2">{description}</p>
            </div>
            <div className="my-2">
              <h2 className="dark:text-white">🎯 Requirements</h2>
              {listedRequirements.length > 0 ? (
                <ul className="p-2">
                  {listedRequirements.map((requirement, idx) => (
                    <li key={idx} className="ml-6 list-disc">
                      {requirement}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-2">{requirements}</p>
              )}
            </div>
            <div className="my-2">
              <h2 className="dark:text-white">🎖️ Nice to have</h2>
              {listedNiceToHave.length > 0 ? (
                <ul className="p-2">
                  {listedNiceToHave.map((niceToHave, idx) => (
                    <li key={idx} className="ml-6 list-disc">
                      {niceToHave}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-2">{niceToHave}</p>
              )}
            </div>
            <div className="my-2">
              <h2 className="dark:text-white">💸 Rate Range</h2>
              <p className="p-2">{rateRange}</p>
            </div>
          </div>
        </header>
      </div>
    );
  }
}
