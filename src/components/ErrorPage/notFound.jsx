import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <section className="min-h-screen bg-gradient-to-tr from-slate-200 via-white to-slate-500 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <div className="text-center space-y-8">
          {/* 404 Display */}
          <div className="relative">
            <h1 className="text-[160px] font-bold text-slate-600 leading-none select-none">
              404
            </h1>
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-slate-800">
              Page Not Found
            </h2>
            <p className="text-slate-600 text-lg max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. Perhaps
              you've mistyped the URL or the page has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>

          {/* Additional Help */}
          <div className="pt-8 border-t border-slate-600 mt-12">
            <p className="text-sm text-slate-500">
              Need help?{" "}
              <a
                href="/contact"
                className="text-slate-700 hover:text-slate-900 font-medium underline"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
