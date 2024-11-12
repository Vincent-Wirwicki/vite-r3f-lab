import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Nav />
      <main className="absolute top-0 left-0 w-screen h-screen ">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;

const Nav = () => {
  const paths = [
    { path: "/", title: "home" },
    { path: "/about", title: "about" },
    { path: "/disp-gallery-1", title: "gal" },
    { path: "/basic-1", title: "gal" },
    { path: "/abstract-1", title: "abs" },
  ];
  return (
    <nav className="fixed top-5 left-5 z-10 text-neutral-500 flex gap-5">
      {paths.map(({ path, title }, i) => (
        <MyLink key={`${path}-${title}-${i}`} path={path} title={title} />
      ))}
    </nav>
  );
};

const MyLink = ({ path, title }: { path: string; title: string }) => {
  return (
    <NavLink className="[&.active]:text-neutral-200" to={path}>
      {title}
    </NavLink>
  );
};
