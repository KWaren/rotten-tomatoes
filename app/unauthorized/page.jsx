import Link from "next/link";
export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-100">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-6">
                    You do not have permission to view this page.
                </p>
                <Link href="/login" className="text-red-400 hover:underline font-medium">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
