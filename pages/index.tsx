import type { NextPage } from 'next';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Cpu, Shield, Accessibility, BarChart4, Zap, Wallet } from 'lucide-react';

const Home: NextPage = () => {
  const { login, authenticated, ready } = usePrivy();
  const heroRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);
  
  // GSAP animation for the hero section
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dataReducedMotion = document.documentElement.getAttribute('data-reduced-motion') === 'true';
    
    if (!prefersReducedMotion && !dataReducedMotion && heroRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(
        heroRef.current.querySelector('h1'), 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(
        heroRef.current.querySelector('p'), 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: -0.6, ease: 'power3.out' }
      )
      .fromTo(
        heroRef.current.querySelectorAll('.hero-button'), 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
    
    // Animate feature cards with staggered entrance
    if (!prefersReducedMotion && !dataReducedMotion && featureCardsRef.current) {
      gsap.fromTo(
        featureCardsRef.current.querySelectorAll('.feature-card'),
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.15, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featureCardsRef.current,
            start: 'top 80%',
          }
        }
      );
    }
  }, []);
  
  return (
    <Layout title="Hummingbot Interface - Trading Bot Management">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative bg-gradient-to-b from-background to-background/80 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Background blurred shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50 dark:opacity-25">
          <div className="absolute right-1/4 top-1/4 w-96 h-96 bg-[hsl(var(--hbot-blue))] rounded-full filter blur-[120px]" />
          <div className="absolute left-1/3 bottom-1/4 w-64 h-64 bg-[hsl(var(--hbot-purple))] rounded-full filter blur-[90px]" />
          <div className="absolute left-1/4 top-1/3 w-72 h-72 bg-[hsl(var(--hbot-green))] rounded-full filter blur-[110px]" />
        </div>

        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--hbot-blue))] to-[hsl(var(--hbot-purple))]"
            >
              Hummingbot Interface
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 mx-auto max-w-3xl">
              A modern, user-friendly interface for managing and assessing your crypto trading bots with advanced visualization and accessibility features.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!ready ? (
                <div className="shimmer w-32 h-12 rounded-md"></div>
              ) : authenticated ? (
                <Button 
                  variant="hbot" 
                  size="lg"
                  asChild
                  className="hero-button"
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="hbot"
                  size="lg"
                  onClick={() => login()}
                  className="hero-button"
                >
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="hero-button"
              >
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Floating shape animation */}
          <div className="absolute right-10 bottom-10 w-32 h-32 opacity-60 hidden md:block">
            <div className="relative w-full h-full floating">
              <div className="absolute inset-0 bg-[hsl(var(--hbot-blue))] rounded-2xl rotate-12 opacity-20"></div>
              <div className="absolute inset-2 bg-[hsl(var(--hbot-blue))] rounded-2xl rotate-6 opacity-40"></div>
              <div className="absolute inset-4 bg-[hsl(var(--hbot-blue))] rounded-2xl opacity-80 flex items-center justify-center">
                <BarChart4 className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        className="py-20 bg-muted/30" 
        aria-labelledby="features-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 
              id="features-heading"
              className="text-3xl font-bold mb-4"
            >
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage and optimize your trading bots in one beautiful interface
            </p>
          </div>
          
          <div 
            ref={featureCardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <Card className="feature-card card-hover border-border/40">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-[hsl(var(--hbot-blue))]" />
                </div>
                <CardTitle>Modern Interface</CardTitle>
                <CardDescription>
                  Built with Next.js and TypeScript for a smooth, responsive experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enjoy a modern UI with dark mode support, smooth animations, and responsive design that works on all devices.
                </p>
              </CardContent>
            </Card>
            
            <Card className="feature-card card-hover border-border/40">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-[hsl(var(--hbot-green))]" />
                </div>
                <CardTitle>Secure Authentication</CardTitle>
                <CardDescription>
                  Login with email, social accounts, or connect your crypto wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Multiple authentication options with Privy integration ensure your account stays secure while providing a seamless experience.
                </p>
              </CardContent>
            </Card>
            
            <Card className="feature-card card-hover border-border/40">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Accessibility className="h-6 w-6 text-[hsl(var(--hbot-purple))]" />
                </div>
                <CardTitle>Accessible Design</CardTitle>
                <CardDescription>
                  ARIA-compliant interface with keyboard navigation support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We've built accessibility into the core of our interface, with features like high contrast mode, screen reader support, and keyboard navigation.
                </p>
              </CardContent>
            </Card>
            
            <Card className="feature-card card-hover border-border/40">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart4 className="h-6 w-6 text-[hsl(var(--hbot-blue))]" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Visualize performance metrics with interactive charts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track your bot performance with detailed, real-time analytics dashboards and customizable reporting tools.
                </p>
              </CardContent>
            </Card>
            
            <Card className="feature-card card-hover border-border/40">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-[hsl(var(--hbot-warning))]" />
                </div>
                <CardTitle>Real-time Monitoring</CardTitle>
                <CardDescription>
                  Stay updated with live performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get instant notifications and real-time updates on your trading bots' status and performance changes.
                </p>
              </CardContent>
            </Card>
            
            <Card className="feature-card card-hover border-border/40">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-[hsl(var(--hbot-green))]" />
                </div>
                <CardTitle>Multi-wallet Support</CardTitle>
                <CardDescription>
                  Connect and manage multiple crypto wallets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seamlessly connect multiple wallets from different blockchains to have a complete overview of your assets.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to optimize your trading strategy?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of traders who use Hummingbot Interface to manage and improve their automated trading strategies.
            </p>
            
            <Button 
              variant="hbot" 
              size="lg"
              onClick={() => !authenticated && login()}
              asChild={authenticated}
              className="gsap-reveal"
            >
              {authenticated ? (
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
