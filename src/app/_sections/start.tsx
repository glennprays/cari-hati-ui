"use client";

import { useEffect, useState } from "react";
import WelcomePage from "./welcome";
import LoginPage from "./login";
import Aggrement from "./registrations/aggrement";

export default function StartPage() {
    const [currentComponent, setCurrentComponent] = useState<
        "welcome" | "login" | "registration"
    >("welcome");

    const handleToggleLogin = () => {
        setCurrentComponent("login");
    };

    const handleToggleRegistration = () => {
        setCurrentComponent("registration");
    };

    const handleToggle = () => {
        setCurrentComponent("welcome");
    };

    useEffect(() => {
        const handleBackButton = () => {
            switch (currentComponent) {
                case "login":
                    setCurrentComponent("welcome");
                    break;
                case "registration":
                    setCurrentComponent("welcome");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [currentComponent]);

    return (
        <div suppressHydrationWarning>
            {currentComponent === "welcome" ? (
                <WelcomePage
                    onToggleLogin={handleToggleLogin}
                    onToggleRegistration={handleToggleRegistration}
                />
            ) : currentComponent === "login" ? (
                <LoginPage />
            ) : (
                <Aggrement />
            )}
        </div>
    );
}
