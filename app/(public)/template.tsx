export default function PublicTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="public-route-transition">{children}</div>;
}
