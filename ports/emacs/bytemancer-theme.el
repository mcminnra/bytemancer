;;; bytemancer-theme.el  --- Bytemancer - Theme custom tailored to mancing bytes -*- lexical-binding: t; -*-

;; Maintainer: Ryder McMinn
;; Author: Ryder McMinn
;; Version: 0.1.0
;; Package-Requires: ((emacs "27.1"))

;;; Commentary:

;; GENERATED FILE -- do not edit by hand.
;; Regenerate from the bytemancer repo.

;;; Code:


;;; Theme definition:
(deftheme bytemancer "Theme custom tailored to mancing bytes.")

;; Palette (generated from flavors/dark.toml)
(let (
      (base "#131313")
      (raised "#191919")
      (overlay "#1A1B2A")
      (selection "#2b2d45")
      (fg "#bfc2cc")
      (fg_bright "#e0e2ea")
      (fg_muted "#4A5057")
      (red "#EE6D85")
      (orange "#F6955B")
      (yellow "#D7A65F")
      (green "#95C561")
      (blue "#7199EE")
      (cyan "#38A89D")
      (purple "#A485DD")
      (red_bg "#5b0b19")
      (red_bg2 "#2e050d")
      (yellow_bg "#6B5330")
      (green_bg "#344b1b")
      (green_bg2 "#1a250e")
      (blue_bg "#2A3A5A")
      (accent_hover "#b89ee6")
      (black "#000000")
    )

  (custom-theme-set-faces
   'bytemancer

   ;; Basic faces
   `(default ((t (:background ,raised :foreground ,fg))))
   `(cursor ((t (:background ,purple))))
   `(region ((t (:background ,selection))))
   `(highlight ((t (:background ,selection))))
   `(hl-line ((t (:background ,overlay))))
   `(fringe ((t (:background ,raised))))
   `(match ((t (:background ,selection :foreground ,yellow))))
   `(secondary-selection ((t (:background ,selection))))
   `(isearch ((t (:background ,yellow_bg :foreground ,yellow :weight bold))))
   `(isearch-fail ((t (:background ,red_bg :foreground ,red))))
   `(lazy-highlight ((t (:background ,blue_bg :foreground ,blue))))
   `(link ((t (:foreground ,cyan :underline ,cyan))))

   ;; Completion faces
   `(completions-annotations ((t (:foreground ,fg_muted :slant italic))))
   `(show-paren-match ((t (:background ,purple :foreground ,raised :weight bold))))
   `(show-paren-mismatch ((t (:background ,red :foreground ,raised :weight bold))))
   `(window-divider ((t (:background unspecified :foreground ,raised))))
   `(vertical-border ((t (:background unspecified :foreground ,raised))))
   `(error ((t (:foreground ,red :weight bold))))
   `(warning ((t (:foreground ,orange :weight bold))))
   `(success ((t (:foreground ,green :weight bold))))

   ;; Font lock faces (syntax highlighting)
   `(font-lock-builtin-face ((t (:foreground ,purple))))
   `(font-lock-comment-face ((t (:foreground ,fg_muted :slant italic))))
   `(font-lock-constant-face ((t (:foreground ,orange))))
   `(font-lock-number-face ((t (:foreground ,purple))))
   `(font-lock-function-name-face ((t (:foreground ,green))))
   `(font-lock-keyword-face ((t (:foreground ,red))))
   `(font-lock-operator-face ((t (:foreground ,red))))
   `(font-lock-string-face ((t (:foreground ,yellow))))
   `(font-lock-doc-face ((t (:foreground ,yellow :slant italic))))
   `(font-lock-type-face ((t (:foreground ,blue :slant italic))))
   `(font-lock-variable-name-face ((t (:foreground ,fg))))
   `(font-lock-variable-use-face ((t (:foreground ,fg))))
   `(font-lock-property-use-face ((t (:foreground ,fg))))
   `(font-lock-warning-face ((t (:foreground ,red :weight bold))))

   ;; Helm
   `(helm-source-header ((t (:background ,overlay :foreground ,fg))))
   `(helm-selection ((t (:background ,selection))))
   `(helm-M-x-key ((t (:foreground ,yellow :box (:line-width 1 :color ,yellow)))))
   `(helm-match ((t (:foreground ,yellow))))
   `(helm-ff-prefix ((t (:background ,yellow :foreground ,raised))))
   `(helm-ff-directory ((t (:foreground ,red))))

   ;; Solaire
   `(solaire-default-face ((t (:background ,base :foreground ,fg))))
   `(solaire-fringe-face ((t (:background ,base :foreground ,fg))))
   `(solaire-line-number-face ((t (:background ,base :foreground ,fg_muted))))
   `(solaire-mode-line-face ((t (:background ,base :foreground ,fg))))
   `(solaire-mode-line-inactive-face ((t (:background ,base :foreground ,fg))))
   `(solaire-header-line-face ((t (:background ,base :foreground ,fg))))

   ;; Mode line
   `(mode-line ((t (:background ,raised :foreground ,fg :box (:line-width 1 :color ,overlay)))))
   `(mode-line-inactive ((t (:background ,base :foreground ,fg))))
   `(mode-line-active ((t (:background ,overlay :foreground ,fg))))
   `(mode-line-highlight ((t (:background ,purple :foreground ,raised))))

   ;; Minibuffer
   `(minibuffer-prompt ((t (:foreground ,purple :weight bold))))

   ;; Line numbers
   `(line-number ((t (:background ,raised :foreground ,fg_muted))))
   `(line-number-current-line ((t (:background ,raised :foreground ,purple :weight bold))))

   ;; Diff mode (used by diff-hl-diff-goto-hunk)
   `(diff-added ((t (:background ,green_bg2))))
   `(diff-removed ((t (:background ,red_bg2))))
   `(diff-refine-added ((t (:background ,green_bg))))
   `(diff-refine-removed ((t (:background ,red_bg))))
   `(diff-header ((t (:background ,raised :foreground ,fg))))
   `(diff-file-header ((t (:background ,raised :foreground ,fg))))
   `(diff-hunk-header ((t (:background ,selection :foreground ,fg))))

   ;; Ediff
   `(ediff-current-diff-A ((t (:background ,red_bg2))))
   `(ediff-current-diff-B ((t (:background ,green_bg2))))
   `(ediff-fine-diff-A ((t (:background ,red_bg))))
   `(ediff-fine-diff-B ((t (:background ,green_bg))))
   `(ediff-even-diff-A ((t (:background ,red_bg2))))
   `(ediff-even-diff-B ((t (:background ,green_bg2))))
   `(ediff-odd-diff-A ((t (:background ,red_bg2))))
   `(ediff-odd-diff-B ((t (:background ,green_bg2))))

   ;; Magit Diff
   `(magit-diff-added ((t (:background ,green_bg2))))
   `(magit-diff-added-highlight ((t (:background ,green_bg))))
   `(magit-diff-removed ((t (:background ,red_bg2))))
   `(magit-diff-removed-highlight ((t (:background ,red_bg))))
   `(magit-diff-context ((t (:foreground ,fg))))
   `(magit-diff-context-highlight ((t (:background ,raised :foreground ,fg))))
   `(magit-diff-hunk-heading ((t (:background ,overlay :foreground ,fg))))
   `(magit-diff-hunk-heading-highlight ((t (:background ,selection :foreground ,fg))))
   `(magit-section-highlight ((t (:background ,overlay))))

   ;; Rainbow Delimiters
   `(rainbow-delimiters-base-error-face ((t (:foreground ,red))))
   `(rainbow-delimiters-base-face ((t (:foreground ,fg))))
   `(rainbow-delimiters-depth-1-face ((t (:foreground ,purple))))
   `(rainbow-delimiters-depth-2-face ((t (:foreground ,cyan))))
   `(rainbow-delimiters-depth-3-face ((t (:foreground ,blue))))
   `(rainbow-delimiters-depth-4-face ((t (:foreground ,purple))))
   `(rainbow-delimiters-depth-5-face ((t (:foreground ,cyan))))
   `(rainbow-delimiters-depth-6-face ((t (:foreground ,blue))))
   `(rainbow-delimiters-depth-7-face ((t (:foreground ,purple))))
   `(rainbow-delimiters-depth-8-face ((t (:foreground ,cyan))))
   `(rainbow-delimiters-depth-9-face ((t (:foreground ,blue))))
   `(rainbow-delimiters-mismatched-face ((t (:foreground ,red :weight bold))))
   `(rainbow-delimiters-unmatched-face ((t (:foreground ,red :weight bold))))

   ;; Org mode (Emacs-only; references palette names directly, not roles)
   `(org-document-title ((t (:foreground ,orange :weight bold :height 1.5))))
   `(org-document-info ((t (:foreground ,fg :slant italic))))
   `(org-document-info-keyword ((t (:foreground ,fg_muted :slant italic))))
   `(org-meta-line ((t (:foreground ,fg_muted :slant italic))))
   `(org-ellipsis ((t (:foreground ,fg_muted))))
   `(org-list-dt ((t (:foreground ,cyan :weight bold))))
   `(org-checkbox ((t (:foreground ,purple :weight bold))))
   `(org-checkbox-statistics-todo ((t (:foreground ,red))))
   `(org-checkbox-statistics-done ((t (:foreground ,fg_muted))))
   `(org-level-1 ((t (:foreground ,purple :height 1.0))))
   `(org-level-2 ((t (:foreground ,blue :height 1.0))))
   `(org-level-3 ((t (:foreground ,green :height 1.0))))
   `(org-level-4 ((t (:foreground ,purple :height 1.0))))
   `(org-level-5 ((t (:foreground ,blue :height 1.0))))
   `(org-level-6 ((t (:foreground ,green :height 1.0))))
   `(org-level-7 ((t (:foreground ,purple :height 1.0))))
   `(org-level-8 ((t (:foreground ,blue :height 1.0))))
   `(org-level-9 ((t (:foreground ,green :height 1.0))))
   `(org-tag ((t (:foreground ,fg_muted :slant italic))))
   `(org-verbatim ((t (:foreground ,red :slant italic))))
   `(org-code ((t (:foreground ,yellow :background ,overlay))))
   `(org-block ((t (:background ,overlay))))
   `(org-block-begin-line ((t (:background ,overlay :foreground ,fg_muted :slant italic))))
   `(org-block-end-line ((t (:background ,overlay :foreground ,fg_muted :slant italic))))
   `(org-drawer ((t (:foreground ,fg_muted))))
   `(org-special-keyword ((t (:foreground ,fg_muted))))
   `(org-property-value ((t (:foreground ,fg_muted))))
   `(org-done ((t (:foreground ,fg_muted))))
   `(org-headline-done ((t (:foreground ,fg_muted))))
   `(org-table ((t (:foreground ,blue))))
   ; Date-related
   `(org-date ((t (:foreground ,yellow))))
   `(org-time-grid ((t (:foreground ,yellow))))
   `(org-scheduled ((t (:foreground ,fg))))
   `(org-scheduled-today ((t (:foreground ,fg))))
   `(org-scheduled-previously ((t (:foreground ,orange))))
   `(org-imminent-deadline ((t (:foreground ,red))))
   `(org-upcoming-deadline ((t (:foreground ,yellow))))
   `(org-upcoming-distant-deadline ((t (:foreground ,yellow))))
   ; Agenda
   `(org-agenda-done ((t (:foreground ,fg_muted))))
   `(org-agenda-structure ((t (:foreground ,blue))))
   ; Habit
   `(org-habit-ready-face ((t (:background ,green_bg :foreground ,fg))))
   `(org-habit-overdue-face ((t (:background ,red_bg :foreground ,fg))))
   `(org-habit-clear-future-face ((t (:background ,raised :foreground ,fg))))
   `(org-habit-clear-face ((t (:background ,green_bg :foreground ,fg))))
   `(org-habit-alert-future-face ((t (:background ,red_bg :foreground ,fg))))
   `(org-habit-alert-face ((t (:background ,yellow_bg :foreground ,fg))))

   ;; Treemacs
   ; Structure
   `(treemacs-root-face ((t (:foreground ,purple :weight bold :height 1.1))))
   `(treemacs-root-unreadable-face ((t (:foreground ,fg_muted :weight bold :height 1.1 :strike-through t))))
   `(treemacs-directory-face ((t (:foreground ,fg))))
   `(treemacs-directory-collapsed-face ((t (:foreground ,fg_muted))))
   `(treemacs-file-face ((t (:foreground ,fg))))
   `(treemacs-tags-face ((t (:foreground ,purple))))
   `(treemacs-term-node-face ((t (:foreground ,yellow))))
   ; nerd-icons theme faces -- default to orange, which fights the palette
   `(treemacs-nerd-icons-root-face ((t (:foreground ,purple))))
   `(treemacs-nerd-icons-file-face ((t (:foreground ,fg_muted))))
   ; Window chrome -- base bg matches what solaire-global-mode gives side windows
   `(treemacs-window-background-face ((t (:background ,base))))
   `(treemacs-hl-line-face ((t (:background ,selection :extend t))))
   `(treemacs-fringe-indicator-face ((t (:foreground ,purple))))
   `(treemacs-header-button-face ((t (:foreground ,purple :weight bold))))
   ; Git status -- these must not collide with each other or with plain files
   `(treemacs-git-unmodified-face ((t (:foreground ,fg))))
   `(treemacs-git-modified-face ((t (:foreground ,yellow))))
   `(treemacs-git-added-face ((t (:foreground ,green))))
   `(treemacs-git-untracked-face ((t (:foreground ,cyan))))
   `(treemacs-git-renamed-face ((t (:foreground ,purple))))
   `(treemacs-git-ignored-face ((t (:foreground ,fg_muted))))
   `(treemacs-git-conflict-face ((t (:foreground ,red :weight bold))))
   `(treemacs-git-commit-diff-face ((t (:foreground ,fg_muted :slant italic))))
   ; Feedback
   `(treemacs-marked-file-face ((t (:background ,red_bg :foreground ,yellow :weight bold))))
   `(treemacs-on-success-pulse-face ((t (:background ,green_bg :foreground ,fg :extend t))))
   `(treemacs-on-failure-pulse-face ((t (:background ,red_bg :foreground ,fg :extend t))))
   `(treemacs-peek-mode-indicator-face ((t (:background ,green_bg :foreground ,fg))))
   `(treemacs-async-loading-face ((t (:foreground ,fg_muted :slant italic :height 0.8))))
   ; Help buffer
   `(treemacs-help-title-face ((t (:foreground ,purple :weight bold))))
   `(treemacs-help-column-face ((t (:foreground ,yellow :weight bold :underline t))))

  ))

;;;###autoload
(when load-file-name
  (add-to-list 'custom-theme-load-path
               (file-name-as-directory (file-name-directory load-file-name))))

(provide-theme 'bytemancer)
;;; bytemancer-theme.el ends here
