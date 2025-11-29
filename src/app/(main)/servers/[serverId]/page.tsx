interface ServerIdPageProps {
  params: Promise<{ serverId: string }>;
}

export default async function ServerIdPage({ params }: ServerIdPageProps) {
  const { serverId } = await params;

  return <div>{serverId}</div>;
}
