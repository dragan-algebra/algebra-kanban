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

import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";


const MarketingLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full bg-slate-100">
            <Navbar />
            <main className="pt-40 pb-20 bg-slate-100">
            {children}
            </main>
            <Footer />
        </div>
    );
};

export default MarketingLayout;