import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SSHCredentials } from "@/hooks/useSSH";

interface SSHLoginProps {
  onConnect: (credentials: SSHCredentials) => void;
  onCancel: () => void;
  isConnecting: boolean;
  error: string | null;
}

export function SSHLogin({
  onConnect,
  onCancel,
  isConnecting,
  error,
}: SSHLoginProps) {
  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [port, setPort] = useState("22");
  const [authMethod, setAuthMethod] = useState<"password" | "key">("password");
  
  const formRef = useRef<HTMLDivElement>(null);
  const hostInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const keyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const portInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePageClick = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        hostInputRef.current?.focus();
      }
    };

    document.addEventListener("click", handlePageClick);
    return () => document.removeEventListener("click", handlePageClick);
  }, []);

  useEffect(() => {
    hostInputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!host || !username) return;

    const credentials: SSHCredentials = {
      host,
      username,
      port: parseInt(port) || 22,
    };

    if (authMethod === "password" && password) {
      credentials.password = password;
    } else if (authMethod === "key" && privateKey) {
      credentials.privateKey = privateKey;
    }

    onConnect(credentials);
  };

  const focusNext = (currentRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>) => {
    if (currentRef === hostInputRef && host) {
      usernameInputRef.current?.focus();
    } else if (currentRef === usernameInputRef && username) {
      if (authMethod === "password") {
        passwordInputRef.current?.focus();
      } else {
        keyTextareaRef.current?.focus();
      }
    } else if (currentRef === passwordInputRef && password) {
      portInputRef.current?.focus();
    } else if (currentRef === keyTextareaRef && privateKey) {
      portInputRef.current?.focus();
    } else if (currentRef === portInputRef) {
      handleSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>) => {
    if (e.key === "Escape") {
      onCancel();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      focusNext(currentRef);
    }

    if (e.key === "Tab" && currentRef === passwordInputRef) {
      e.preventDefault();
      setAuthMethod(authMethod === "password" ? "key" : "password");
      setTimeout(() => {
        if (authMethod === "password") {
          keyTextareaRef.current?.focus();
        } else {
          passwordInputRef.current?.focus();
        }
      }, 0);
    }
  };

  return (
    <div 
      ref={formRef}
      className="font-mono text-sm leading-tight space-y-1"
      style={{ fontFamily: "var(--font-geist-mono)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* SSH Connection Header */}
      <div className="mb-3">
        <span className="text-[hsl(var(--terminal-text))]">ssh connection setup</span>
      </div>

      {/* Host */}
      <div className="flex items-center">
        <span className="text-[hsl(var(--terminal-prompt))] select-none w-12">host:</span>
        <input
          ref={hostInputRef}
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, hostInputRef)}
          className="bg-transparent border-none outline-none text-[hsl(var(--terminal-text))] flex-1 ml-2"
          placeholder="server.example.com"
          disabled={isConnecting}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-form-type="other"
          data-lpignore="true"
          data-1p-ignore="true"
          data-bwignore="true"
          name="ssh-host-field"
        />
      </div>

      {/* Username */}
      <div className="flex items-center">
        <span className="text-[hsl(var(--terminal-prompt))] select-none w-12">user:</span>
        <input
          ref={usernameInputRef}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, usernameInputRef)}
          onClick={() => usernameInputRef.current?.focus()}
          className="bg-transparent border-none outline-none text-[hsl(var(--terminal-text))] flex-1 ml-2"
          placeholder="root"
          disabled={isConnecting}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-form-type="other"
          data-lpignore="true"
          data-1p-ignore="true"
          data-bwignore="true"
          name="ssh-username-field"
        />
      </div>

      {/* Auth Method Selection */}
      <div className="flex items-center">
        <span className="text-[hsl(var(--terminal-prompt))] select-none w-12">auth:</span>
        <div className="flex items-center ml-2 space-x-3">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("password");
              setTimeout(() => passwordInputRef.current?.focus(), 0);
            }}
            className={cn(
              "text-sm transition-colors",
              authMethod === "password" ? "text-primary" : "text-muted-foreground hover:text-[hsl(var(--terminal-text))]"
            )}
            disabled={isConnecting}
          >
            [password]
          </button>
          <span className="text-muted-foreground">/</span>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("key");
              setTimeout(() => keyTextareaRef.current?.focus(), 0);
            }}
            className={cn(
              "text-sm transition-colors",
              authMethod === "key" ? "text-primary" : "text-muted-foreground hover:text-[hsl(var(--terminal-text))]"
            )}
            disabled={isConnecting}
          >
            [key]
          </button>
        </div>
      </div>

      {/* Password or SSH Key */}
      {authMethod === "password" ? (
        <div className="flex items-center">
          <span className="text-[hsl(var(--terminal-prompt))] select-none w-12">pass:</span>
                     <input
             ref={passwordInputRef}
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             onKeyDown={(e) => handleKeyDown(e, passwordInputRef)}
             onClick={() => passwordInputRef.current?.focus()}
             className="bg-transparent border-none outline-none text-[hsl(var(--terminal-text))] flex-1 ml-2"
             placeholder="••••••••"
             disabled={isConnecting}
             autoComplete="off"
             autoCorrect="off"
             autoCapitalize="off"
             spellCheck="false"
             data-form-type="other"
             data-lpignore="true"
             data-1p-ignore="true"
             data-bwignore="true"
             name="ssh-password-field"
           />
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-1">
            <span className="text-[hsl(var(--terminal-prompt))] select-none w-12">key:</span>
            <span className="text-muted-foreground text-xs ml-2">private key content</span>
          </div>
          <textarea
            ref={keyTextareaRef}
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onCancel();
                return;
              }
              if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault();
                focusNext(keyTextareaRef);
              }
            }}
            onClick={() => keyTextareaRef.current?.focus()}
            className="w-full h-20 bg-transparent border border-border rounded text-xs text-[hsl(var(--terminal-text))] p-2 resize-none focus:ring-0 focus:border-primary font-mono ml-12"
            placeholder="-----BEGIN OPENSSH PRIVATE KEY-----&#10;...&#10;-----END OPENSSH PRIVATE KEY-----"
            disabled={isConnecting}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            data-form-type="other"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          />
          <div className="text-xs text-muted-foreground ml-12 mt-1">
            ctrl+enter to continue
          </div>
        </div>
      )}

      {/* Port */}
      <div className="flex items-center">
        <span className="text-[hsl(var(--terminal-prompt))] select-none w-12">port:</span>
        <input
          ref={portInputRef}
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, portInputRef)}
          onClick={() => portInputRef.current?.focus()}
          className="bg-transparent border-none outline-none text-[hsl(var(--terminal-text))] w-20 ml-2"
          placeholder="22"
          disabled={isConnecting}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-form-type="other"
          min="1"
          max="65535"
        />
        <span className="text-muted-foreground text-xs ml-2">(default: 22)</span>
      </div>

      {/* Status/Error */}
      {error && (
        <div className="mt-2 text-destructive text-sm">
          <span className="text-[hsl(var(--terminal-prompt))]">error:</span>
          <span className="ml-2">{error}</span>
        </div>
      )}

             {/* Instructions */}
       <div className="mt-3 text-muted-foreground text-xs space-y-1">
         {isConnecting ? (
           <div className="text-[hsl(var(--terminal-text))]">connecting...</div>
         ) : (
           <>
             <div>enter to continue, esc to cancel</div>
             {authMethod === "password" && (
               <div>tab on password field to switch to ssh key</div>
             )}
             {authMethod === "key" && (
               <div>ctrl+enter to continue from key field</div>
             )}
           </>
         )}
       </div>
    </div>
  );
}
