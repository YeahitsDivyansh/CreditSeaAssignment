const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm">
            © 2024 CreditSea. All rights reserved.
          </div>
          <div className="text-gray-500 text-xs mt-2 md:mt-0">
            Built with React, Node.js, Express & MongoDB
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
