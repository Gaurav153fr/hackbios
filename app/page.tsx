import ChatBox from "@/components/Chatbox";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black ">
      <main className="flex min-h-screen w-full  flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
<div className=" flex justify-start  relative">
  <img src="hero_image.jpg" alt="" className="items-start self-start" />
  <div className="absolute top-1/3 left-0 transform  -translate-y-1/2 text-white max-w-2xl">
    <h3 className="text-7xl font-extrabold">Import/Export</h3>
    <p>Your Global Partner in Shipping and Freight. Unlocking new horizons with seamless logistics solutions. We deliver convenience, ensure unmatched security for every shipment, and build trust with every private deal. Experience effortless global trade.</p>
  </div>
</div>
      </main>
    </div>
  );
}
