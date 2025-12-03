interface ConversationIdPageProps {
  params: Promise<{ serverId: string; conversationId: string }>;
}

export default async function ConversationIdPage({ params }: ConversationIdPageProps) {
  const { conversationId } = await params;

  return <div>{conversationId}</div>;
}
