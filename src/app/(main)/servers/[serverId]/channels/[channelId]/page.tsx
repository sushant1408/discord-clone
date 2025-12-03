interface ChannelIdPageProps {
  params: Promise<{ serverId: string; channelId: string }>;
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const { channelId } = await params;

  return <div>{channelId}</div>;
}
