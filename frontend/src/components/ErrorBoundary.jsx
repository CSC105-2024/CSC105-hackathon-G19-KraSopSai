import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Render error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-screen p-8 text-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Something broke</h2>
                        <p className="text-gray-600 mb-4">Refresh the page to retry.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-pink-500 text-white rounded"
                        >
                            Reload
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
