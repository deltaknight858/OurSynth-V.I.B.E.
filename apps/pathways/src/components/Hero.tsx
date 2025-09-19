'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { AutoAwesome as AIIcon, ArrowForward as ArrowIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Hero() {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(80, 39, 176, 0.1) 100%)',
        overflow: 'hidden',
        padding: { xs: 2, md: 4 },
      }}
    >
      {/* Animated Background Data Nodes */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Top-left cluster */}
        <div 
          className="data-node" 
          style={{ 
            top: '15%', 
            left: '10%',
            animationDelay: '0s',
            animationDuration: '3s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            top: '20%', 
            left: '15%',
            animationDelay: '0.5s',
            animationDuration: '2.5s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            top: '12%', 
            left: '18%',
            animationDelay: '1s',
            animationDuration: '2.8s'
          }} 
        />
        
        {/* Top-right cluster */}
        <div 
          className="data-node" 
          style={{ 
            top: '18%', 
            right: '12%',
            animationDelay: '0.3s',
            animationDuration: '3.2s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            top: '25%', 
            right: '8%',
            animationDelay: '1.2s',
            animationDuration: '2.7s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            top: '14%', 
            right: '20%',
            animationDelay: '2s',
            animationDuration: '3s'
          }} 
        />

        {/* Middle-left */}
        <div 
          className="data-node" 
          style={{ 
            top: '45%', 
            left: '5%',
            animationDelay: '0.8s',
            animationDuration: '2.9s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            top: '55%', 
            left: '12%',
            animationDelay: '1.5s',
            animationDuration: '2.6s'
          }} 
        />

        {/* Middle-right */}
        <div 
          className="data-node" 
          style={{ 
            top: '42%', 
            right: '7%',
            animationDelay: '0.7s',
            animationDuration: '3.1s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            top: '60%', 
            right: '15%',
            animationDelay: '1.8s',
            animationDuration: '2.4s'
          }} 
        />

        {/* Bottom clusters */}
        <div 
          className="data-node" 
          style={{ 
            bottom: '20%', 
            left: '8%',
            animationDelay: '1.1s',
            animationDuration: '2.8s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            bottom: '15%', 
            left: '22%',
            animationDelay: '0.4s',
            animationDuration: '3.3s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            bottom: '25%', 
            right: '10%',
            animationDelay: '1.6s',
            animationDuration: '2.5s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            bottom: '18%', 
            right: '25%',
            animationDelay: '0.9s',
            animationDuration: '3.4s'
          }} 
        />

        {/* Scattered nodes */}
        <div 
          className="data-node" 
          style={{ 
            top: '35%', 
            left: '25%',
            animationDelay: '2.1s',
            animationDuration: '2.3s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            top: '65%', 
            left: '35%',
            animationDelay: '0.6s',
            animationDuration: '3.5s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            top: '30%', 
            right: '30%',
            animationDelay: '1.4s',
            animationDuration: '2.7s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            bottom: '35%', 
            left: '45%',
            animationDelay: '1.9s',
            animationDuration: '2.9s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            top: '70%', 
            right: '40%',
            animationDelay: '0.2s',
            animationDuration: '3.1s'
          }} 
        />
        <div 
          className="data-node" 
          style={{ 
            bottom: '40%', 
            right: '35%',
            animationDelay: '1.7s',
            animationDuration: '2.6s'
          }} 
        />
      </Box>

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          className="glass"
          sx={{
            padding: { xs: 4, md: 6, lg: 8 },
            textAlign: 'center',
            borderRadius: '24px',
            maxWidth: '900px',
            margin: '0 auto',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
            },
          }}
        >
          {/* AI Icon with glow effect */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #a020f0, #000000)',
              marginBottom: 4,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #a020f0, #00ff00)',
                opacity: 0.3,
                filter: 'blur(8px)',
                zIndex: -1,
                animation: 'pulse 2s infinite',
              },
            }}
          >
            <AIIcon 
              sx={{ 
                fontSize: 40, 
                color: 'white',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }} 
            />
          </Box>

          {/* Main Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #000000 0%, #a020f0 50%, #000000 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 3,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120px',
                height: '4px',
                background: 'linear-gradient(45deg, #a020f0, #00ff00)',
                borderRadius: '2px',
                opacity: 0.6,
              },
            }}
          >
            Your AI-Powered
            <br />
            UI Pathway
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              color: 'rgba(0, 0, 0, 0.8)',
              marginBottom: 4,
              lineHeight: 1.6,
              fontWeight: 400,
              maxWidth: '600px',
              margin: '0 auto 2rem auto',
              textShadow: '0 2px 4px rgba(255, 255, 255, 0.5)',
            }}
          >
            Transform your ideas into beautiful React components with the power of AI. 
            Generate, customize, and save stunning UI elements in seconds.
          </Typography>

          {/* Feature highlights */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 2, sm: 4 },
              marginBottom: 4,
              flexWrap: 'wrap',
            }}
          >
            {[
              '🤖 AI-Powered Generation',
              '⚡ Lightning Fast',
              '🎨 Glass Morphism Design',
              '💾 Save & Organize'
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: 'rgba(160, 32, 240, 0.1)',
                  border: '1px solid rgba(160, 32, 240, 0.2)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#a020f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(160, 32, 240, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(160, 32, 240, 0.3)',
                  },
                }}
              >
                {feature}
              </Box>
            ))}
          </Box>

          {/* Call-to-Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 4,
            }}
          >
            <Button
              component={Link}
              href={user ? "/generator" : "/auth/signup"}
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                padding: '12px 32px',
                borderRadius: '16px',
                background: 'linear-gradient(45deg, #a020f0, #000000)',
                color: 'white',
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(160, 32, 240, 0.4)',
                transition: 'all 0.3s ease',
                minWidth: '200px',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c040ff, #333333)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 35px rgba(160, 32, 240, 0.6)',
                },
                '&:active': {
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {user ? "Start Generating" : "Get Started Free"}
            </Button>

            {!user && (
              <Button
                component={Link}
                href="/auth/signin"
                variant="outlined"
                size="large"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  padding: '12px 32px',
                  borderRadius: '16px',
                  color: '#000000',
                  borderColor: 'rgba(0, 0, 0, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  textTransform: 'none',
                  minWidth: '200px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(160, 32, 240, 0.1)',
                    borderColor: '#a020f0',
                    color: '#a020f0',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(160, 32, 240, 0.2)',
                  },
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Box>
      </Container>

      {/* Floating accent elements */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '2px',
          background: 'linear-gradient(45deg, transparent, #a020f0, transparent)',
          opacity: 0.6,
          animation: 'pulse 3s infinite',
        }}
      />
    </Box>
  );
}
