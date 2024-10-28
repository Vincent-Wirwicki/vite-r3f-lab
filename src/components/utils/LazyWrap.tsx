import { ReactNode, Suspense } from "react";

const LazyWrap = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
};

const Loader = () => {
  return <div>Loading</div>;
};

export default LazyWrap;
