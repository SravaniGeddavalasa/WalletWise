import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

import { 
  ArrowRight, TrendingDown, TrendingUp, Target, 
  BrainCircuit, FileSpreadsheet,
  UserPlus, ShieldCheck, PlusCircle, Scale, BarChart4, Download
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const features = [
  {
    title: "Expense Tracking",
    description: "Easily monitor and record every single expense with custom categories, descriptions, and dates.",
    icon: TrendingDown,
    link: "/expense-tracking"
  },
  {
    title: "Income Management",
    description: "Track all salary, freelance, or secondary cash flows to keep an accurate picture of your income.",
    icon: TrendingUp,
    link: "/income-management"
  },
  {
    title: "Budget Planning",
    description: "Set category-based monthly spending limits and track warnings as you approach them.",
    icon: Target,
    link: "/budget-planning"
  },
  {
    title: "Report Generation",
    description: "Export transaction data instantly to clean PDF and structured Excel spreadsheets.",
    icon: FileSpreadsheet,
    link: "/report-generation"
  },
];

const steps = [
  {
    title: "Create Account",
    description: "Sign up in seconds. All you need is an email to start organizing your finances.",
    icon: UserPlus,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Login Securely",
    description: "Log in with industry-standard secure authentication to keep your financial data protected.",
    icon: ShieldCheck,
    color: "from-purple-500 to-indigo-500"
  },
  {
    title: "Add Transactions",
    description: "Quickly record income or expenses, and upload bills or receipts instantly.",
    icon: PlusCircle,
    color: "from-emerald-500 to-teal-500"
  },
  {
    title: "Track Expenses & Income",
    description: "Categorize and monitor all cashflows to understand exactly where your money comes and goes.",
    icon: Scale,
    color: "from-orange-500 to-amber-500"
  },
  {
    title: "Analyze Spending",
    description: "Explore clean, beautiful interactive charts showing monthly distribution and trends.",
    icon: BarChart4,
    color: "from-pink-500 to-rose-500"
  },
  {
    title: "Download Reports",
    description: "Generate and download professional PDF/Excel summaries for tax or tracking purposes.",
    icon: Download,
    color: "from-indigo-500 to-blue-500"
  },
  {
    title: "Get AI Smart Insights",
    description: "Let our smart AI analyze your budget limits and suggest how you can save more.",
    icon: BrainCircuit,
    color: "from-violet-500 to-fuchsia-500"
  }
];



const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] -z-10" />
          
          <div className="container mx-auto text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                ✨ The future of personal finance
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Master your money with <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  intelligent insights
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Track expenses, set budgets, and achieve your financial goals with WalletWise's beautiful and intuitive dashboard.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                    See How it Works
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to succeed</h2>
              <p className="text-muted-foreground">Powerful features designed to give you complete control over your financial life.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

              {features.map((feature, index) => (
                <Link to={feature.link} key={index} className="block">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                    viewport={{ once: true }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group h-full p-6 rounded-2xl bg-background/60 backdrop-blur-xl border hover:border-primary/50 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <motion.div 
                      className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 relative"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="h-6 w-6 text-primary relative z-10" />
                    </motion.div>
                    
                    <h3 className="text-lg font-bold mb-2 relative z-10 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed relative z-10 group-hover:text-foreground/80 transition-colors">{feature.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-4 bg-background scroll-mt-20 relative overflow-hidden">
          <div className="absolute top-1/3 right-1/10 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div className="container mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground">Get up and running with WalletWise in seven straightforward steps.</p>
            </div>

            {/* Timeline Layout */}
            <div className="relative border-l-2 border-muted md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-0.5 md:before:bg-muted pl-8 md:pl-0 space-y-12">
              {steps.map((step, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={index} className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} justify-between`}>
                    {/* Timeline Node Icon (Center) */}
                    <div className="absolute -left-[45px] md:left-1/2 md:-translate-x-1/2 flex items-center justify-center z-10">
                      <div className="h-8 w-8 rounded-full bg-background border-2 border-primary flex items-center justify-center font-bold text-xs text-primary shadow-md">
                        {index + 1}
                      </div>
                    </div>

                    {/* Timeline Card */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                      viewport={{ once: true, margin: "-100px" }}
                      className={`w-full md:w-[45%] rounded-2xl border p-6 shadow-sm hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-md hover:border-primary/40 group relative overflow-hidden`}
                    >
                      {/* Accent glow top border */}
                      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${step.color}`} />
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-md`}>
                          <step.icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{step.title}</h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                        {step.description}
                      </p>
                    </motion.div>

                    {/* Spacer for MD layouts */}
                    <div className="hidden md:block w-[45%]" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section id="dashboard" className="py-24 px-4 bg-muted/30 scroll-mt-20 overflow-hidden">
          <div className="container mx-auto">
            <div className="bg-gradient-to-b from-primary/5 to-transparent rounded-3xl p-8 md:p-12 border relative">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">A dashboard that makes sense</h2>
                <p className="text-muted-foreground">No more spreadsheets. Just clear, actionable insights beautifully presented.</p>
              </div>
              <div className="relative mx-auto max-w-5xl rounded-xl border bg-background shadow-2xl overflow-hidden aspect-video">
                {/* A mockup placeholder representing the dashboard */}
                <div className="absolute inset-0 bg-muted/20 flex flex-col">
                  <div className="h-12 border-b flex items-center px-4 gap-2 bg-background">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 p-6 grid grid-cols-4 gap-4 opacity-50">
                    <div className="col-span-4 flex gap-4 h-24">
                      {[1,2,3,4].map(i => <div key={i} className="flex-1 rounded-xl bg-primary/10 border" />)}
                    </div>
                    <div className="col-span-3 rounded-xl bg-card border h-64" />
                    <div className="col-span-1 rounded-xl bg-card border h-64" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[2px]">
                  <Link to="/dashboard">
                    <Button size="lg" className="shadow-xl px-8 py-6 text-base rounded-full">
                      View Live Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to take control of your finances?</h2>
            <p className="text-xl text-muted-foreground mb-10">Sign up today and start making smarter financial decisions.</p>
            <Link to="/register">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;