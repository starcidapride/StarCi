const ChildrenLayout = ({
    children,
}: {
  children: React.ReactNode
}) => (
    <main className="justify-center flex mt-6">
        <section className="max-w-screen-lg px-6 w-full">
            {children}
        </section>
    </main>
)

export default ChildrenLayout
