import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Award, Briefcase, BarChart, User, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Navigation } from '../components/Navigation';

export default function HomePage() {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-amber-50 font-sans antialiased text-foreground">
      <div className="w-full py-12">
        <main className="grid grid-cols-1 gap-6">
          <div className="w-full flex flex-col items-center justify-center space-y-8">
            {/* About Section */}
            <div className="w-full bg-white/90 backdrop-blur-sm px-16 py-16 shadow-xl mb-12 border-y border-primary/10">
              <h2 className="text-5xl font-extrabold text-primary mb-3 text-center drop-shadow-sm">SPAM</h2>
              <p className="text-xl text-muted-foreground font-semibold mb-6 text-center">
                Student Portfolio & Achievement Management - The Smart Student Hub
              </p>
              <p className="text-lg text-foreground/80 mb-10 max-w-4xl mx-auto text-center leading-relaxed">
                SPAM is a smart, centralized digital platform designed for higher education institutions. 
                It solves the problem of scattered student records by providing a single hub for managing 
                all academic and extracurricular achievements.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border-2 border-primary/10 hover:border-primary/30"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                    <Award className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">Track Achievements</h3>
                  <p className="text-base text-muted-foreground">
                    Centralize all your academic and extracurricular accomplishments.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border-2 border-accent/30 hover:border-accent"
                >
                  <div className="w-20 h-20 rounded-full bg-accent/20 text-accent-foreground flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-accent-foreground mb-3">Digital Portfolio</h3>
                  <p className="text-base text-muted-foreground">
                    Generate professional portfolios with verified achievements.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border-2 border-primary/10 hover:border-primary/30"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                    <BarChart className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">Analytics Dashboard</h3>
                  <p className="text-base text-muted-foreground">
                    Comprehensive insights for administrators and students.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Login CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="w-full bg-white/90 backdrop-blur-sm p-16 shadow-2xl text-center border-y-2 border-primary/20"
            >
              <Zap className="w-24 h-24 text-primary mx-auto mb-6 drop-shadow-md" />
              <h2 className="text-4xl font-extrabold text-primary mb-4">Welcome Back!</h2>
              <p className="text-xl text-muted-foreground mb-8">Please log in to your dashboard.</p>
              <div className="w-full max-w-md mx-auto">
                <Button 
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center py-6 px-8 border border-transparent rounded-full shadow-lg text-lg font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <User className="w-6 h-6 mr-3" />
                  Go to Login Page
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      </div>
    </>
  );
}
