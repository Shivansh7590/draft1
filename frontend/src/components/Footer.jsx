import { Link } from 'react-router-dom';
import { Mail, Share2, Globe, Video } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-mist bg-mist/25">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink">
                <span className="font-display text-lg font-semibold text-signal">N</span>
              </div>
              <span className="font-display text-xl font-semibold text-ink">Nimbus</span>
            </div>
            <p className="text-sm text-slate">
              Premium audio and wearables crafted for those who hear the difference.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink">Shop</h4>
            <ul className="space-y-2 text-sm text-slate">
              <li><Link to="/consumer" className="hover:text-signal">All Products</Link></li>
              <li><Link to="/consumer?section=computer" className="hover:text-signal">Computer</Link></li>
              <li><Link to="/consumer?section=wearables" className="hover:text-signal">Wearables</Link></li>
              <li><Link to="/consumer?section=lifestyle" className="hover:text-signal">Lifestyle</Link></li>
              <li><Link to="/corporate" className="hover:text-signal">Corporate Orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink">Company</h4>
            <ul className="space-y-2 text-sm text-slate">
              <li><Link to="/about" className="hover:text-signal">About Us</Link></li>
              <li><Link to="/join-us" className="hover:text-signal">Join us</Link></li>
              <li><Link to="/contact" className="hover:text-signal">Contact</Link></li>
              <li><a href="#" className="hover:text-signal">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-signal">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink">Stay Connected</h4>
            <div className="flex gap-3">
              {[Share2, Globe, Video, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate shadow-sm transition-colors hover:bg-signal/10 hover:text-signal"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-mist pt-8 text-center text-sm text-slate/70">
          &copy; {new Date().getFullYear()} Nimbus Audio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
