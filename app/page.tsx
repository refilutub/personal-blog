import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col xl:py-15">
        {/*me*/}
        <div className="flex flex-col md:gap-5">
            <div className="flex flex-col gap-2">
                <Image src="/assets/danichka_squere.jpg" alt="me" width="125" height="125" className="rounded-full"></Image>
                {/*about*/}
                <div className="text-sm text-[#9b9c9d]">
                    Software developer and proud student of KFKZ @ ex. exolution
                </div>
            </div>
            {/*social*/}
            <div className="flex flex-row gap-2 md:gap-5">
                <Link href="https://github.com/refilutub">
                <Image className="dark:invert"
                    src="/icons/github.svg" alt="link to github" width="26" height="26"></Image>
                </Link>
                <Link href={"https://linkedin.com/in/maksym-borsuk"}>
                    <Image className="dark:invert"
                    src="/icons/linkedin.svg" alt="link to linkedin" width="26" height="26"></Image>
                </Link>
                <Link href="https://t.me/maksymborsuk">
                <Image className="dark:invert"
                    src="/icons/telegram.svg" alt="link to telegram" width="26" height="26"></Image>
                </Link>
            </div>
        </div>
    </div>
  );
}
