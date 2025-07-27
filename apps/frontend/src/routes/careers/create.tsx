import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/careers/create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/careers/create"!</div>;
}
