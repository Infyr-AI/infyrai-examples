import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Smartphone X",
    description: "Latest model with advanced features and a stunning display.",
    price: "$699",
    imageUrl: "https://placehold.co/300x200/EFEFEF/AAAAAA&text=Smartphone+X",
  },
  {
    id: 2,
    name: "Laptop Pro",
    description: "Powerful laptop for professionals and creatives.",
    price: "$1299",
    imageUrl: "https://placehold.co/300x200/EFEFEF/AAAAAA&text=Laptop+Pro",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    description: "Noise-cancelling headphones with immersive sound.",
    price: "$199",
    imageUrl: "https://placehold.co/300x200/EFEFEF/AAAAAA&text=Headphones",
  },
  {
    id: 4,
    name: "Smartwatch Series 5",
    description: "Track your fitness and stay connected on the go.",
    price: "$249",
    imageUrl: "https://placehold.co/300x200/EFEFEF/AAAAAA&text=Smartwatch",
  },
  {
    id: 5,
    name: "Coffee Maker Deluxe",
    description: "Brew your perfect cup of coffee every morning.",
    price: "$79",
    imageUrl: "https://placehold.co/300x200/EFEFEF/AAAAAA&text=Coffee+Maker",
  },
  {
    id: 6,
    name: "Gaming Console NextGen",
    description: "Experience the future of gaming with ultra-HD graphics.",
    price: "$499",
    imageUrl: "https://placehold.co/300x200/EFEFEF/AAAAAA&text=Gaming+Console",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Our Products
        </h1>
      </header>
      <main className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative w-full h-48">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {product.price}
                  </span>
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="text-center mt-12 py-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Mock E-Commerce. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 dark:text-gray-400"
            href="https://infyr.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
              className="dark:invert"
            />
            Powered by Infyr.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
