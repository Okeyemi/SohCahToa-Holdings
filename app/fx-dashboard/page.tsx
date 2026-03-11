import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { CardsPanel } from "./components/card-panel";
import { FxOverview } from "./components/fx-overview";
import { FxTransactions } from "./components/fx-transaction";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6">
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
            {/* Left Column - FX */}
            <div className="min-w-0 space-y-4">
              <FxOverview />
              <FxTransactions />
            </div>

            {/* Right Column - Cards */}
            <CardsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
