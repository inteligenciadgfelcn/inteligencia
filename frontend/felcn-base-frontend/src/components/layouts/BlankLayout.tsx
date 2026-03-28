import { PropsWithChildren } from 'react';

const BlankLayout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <div className="min-h-screen text-black dark:text-white-dark">{children} </div>
        </>
    );
};

export default BlankLayout;
