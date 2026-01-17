// font should be imported and initialized in the root folder
// const textFont = Poppins({
//     subsets: ["latin"],
//     weight: [
//         "100",
//         "200",
//         "300",
//         "400",
//         "500",
//         "600",
//         "700",
//         "800",
//         "900"
//     ],
// });

import { Navbar } from "./_components/navbar";


const MarketingLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full bg-white">
            <Navbar />
            <main className="h-full pt-80 bg-white">
                {children}
            </main>
        </div>
    );
};

export default MarketingLayout;