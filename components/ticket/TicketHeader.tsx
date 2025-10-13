import Image from "next/image";
import Link from "next/link";

const TicketHeader = () => {
  return (
    <header className="global-header">
      <h1>
        <Link href="/">
          <Image src="/images/logo_01.png" alt="HOME" width={108} height={61} />
        </Link>
      </h1>
      <div className="sub-logo">
        <a
          href="http://www.star-m.jp/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/images/logo_02.png" alt="" width={120} height={13} />
        </a>
      </div>
    </header>
  );
};

export default TicketHeader;
