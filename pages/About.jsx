const { Outlet, NavLink } = ReactRouterDOM

export function About(){
    return (
        <section className="about container">
        <h1>About books...</h1>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio dolore sapiente, iste animi corporis nisi atque tempora assumenda dolores. Nobis nam dolorem rerum illo facilis nemo sit voluptatibus laboriosam necessitatibus!</p>
        <nav style={{ display: 'flex', gap: '10px' }}>
            <NavLink to="/about/team">Team</NavLink>
            <NavLink to="/about/vision">Vision</NavLink>
        </nav>
        <Outlet />
    </section>
    )
}