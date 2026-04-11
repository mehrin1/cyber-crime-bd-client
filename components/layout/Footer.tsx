"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t mt-10">
            <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">

                {/* Brand */}
                <div className="space-y-3">
                    <h2 className="text-xl font-bold">CyberSafe</h2>
                    <p className="text-sm text-muted-foreground">
                        সচেতনতা, সহায়তা এবং নিরাপত্তা—আপনার ডিজিটাল সুরক্ষার জন্য একটি প্ল্যাটফর্ম।
                    </p>
                </div>

                {/* Quick Links */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Quick Links</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/learn">Learn</Link></li>
                        <li><Link href="/help">Get Help</Link></li>
                        <li><Link href="/laws">Laws</Link></li>
                    </ul>
                </div>

                {/* Features */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Features</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Cybercrime Awareness</li>
                        <li>Professional Support</li>
                        <li>Anonymous Reporting</li>
                        <li>Survey & Insights</li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Legal</h3>
                    <p className="text-sm text-muted-foreground">
                        This platform provides informational support only and does not replace
                        official legal or law enforcement services.
                    </p>
                </div>
                {/* <div className="flex gap-3 mt-3">
                    <Facebook size={18} />
                    <Twitter size={18} />
                    <Mail size={18} />
                </div> */}

            </div>

            {/* Bottom Bar */}
            <div className="border-t py-4 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} CyberSafe. All rights reserved.
            </div>
        </footer>
    );
}