"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AboutSection() {
    return (
        <section className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-3xl font-bold">About Our Platform</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    A safe and supportive space to raise awareness about cybercrime,
                    seek help, and empower individuals through knowledge and community.
                </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6 space-y-3">
                        <h2 className="text-xl font-semibold">Our Mission</h2>
                        <p className="text-sm text-muted-foreground">
                            To educate people about cybercrime, provide access to professional
                            support, and create a community where victims can share their
                            experiences safely.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 space-y-3">
                        <h2 className="text-xl font-semibold">Our Vision</h2>
                        <p className="text-sm text-muted-foreground">
                            To build a safer digital world where individuals are aware,
                            protected, and supported against cyber threats.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* What We Offer */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-center">
                    What We Offer
                </h2>

                <div className="grid md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center text-sm">
                            📚 Learn about cybercrime and prevention
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center text-sm">
                            🆘 Get help from verified professionals
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center text-sm">
                            🗣️ Share your experiences anonymously
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center text-sm">
                            📊 Contribute to surveys and insights
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Impact Section */}
            <div className="text-center space-y-3">
                <h2 className="text-xl font-semibold">Our Impact</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                    By combining education, professional support, and community-driven
                    insights, we aim to reduce cybercrime risks and support victims in
                    recovering and taking action.
                </p>
            </div>
        </section>
    );
}